// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  testPeekMsgsLength,
  addServiceBusClientForLiveTesting,
} from "../public/utils/testutils2.js";
import type { AmqpAnnotatedMessage } from "@azure/core-amqp";
import { randomUUID } from "@azure/core-util";
import { TestClientType } from "./utils/testUtils.js";
import { describe, it } from "vitest";
import { assert, should } from "./utils/chai.js";

[
  // when we encode messages the partition+session queues are basically the "hardest" one
  // to do right. There's less concern with the non-session version.
  TestClientType.UnpartitionedQueue,
  TestClientType.UnpartitionedQueueWithSessions,
  TestClientType.PartitionedQueue,
  TestClientType.PartitionedQueueWithSessions,
].forEach((anyRandomTestClientType) => {
  describe(anyRandomTestClientType + ": AMQP (live testing)", () => {
    const sessionId = "session-1";
    const { sender, receiver, entityNames } = addServiceBusClientForLiveTesting(
      anyRandomTestClientType,
      {
        receiveMode: "receiveAndDelete",
        sessionId,
        testEntityOptions: {
          defaultMessageTimeToLive: "P101D",
        },
      },
    );

    describe("AmqpAnnotatedMessage", function (): void {
      function getSampleAmqpAnnotatedMessage(randomTag?: string): AmqpAnnotatedMessage {
        if (randomTag == null) {
          randomTag = Math.random().toString();
        }

        return {
          body: `message body ${randomTag}`,
          bodyType: "data",
          header: {
            deliveryCount: 10, // TODO: Doesn't make sense to set on the message to be sent, should this be removed for sending?
            durable: false,
            firstAcquirer: false,
            priority: 20,
            timeToLive: 100000,
          },
          applicationProperties: {
            propOne: 1,
            propTwo: "two",
            propThree: true,
            propFour: Date(),
          },
          // deliveryAnnotations - TODO: should this be removed for sending?
          footer: {
            propFooter: "foot",
          },
          messageAnnotations: { propMsgAnnotate: "annotation" },
          properties: {
            contentEncoding: "application/json; charset=utf-8",
            correlationId: randomTag,
            messageId: randomUUID(),
          },
        };
      }

      async function receiveMsg(testMessage: AmqpAnnotatedMessage): Promise<void> {
        const msgs = await receiver().receiveMessages(1);

        should.equal(Array.isArray(msgs), true, "`ReceivedMessages` is not an array");
        should.equal(msgs.length, 1, "Unexpected number of messages");
        should.equal(msgs[0].body, testMessage.body, "Unexpected body on the received message");
        const rawAmqpMessage = msgs[0]._rawAmqpMessage;
        should.equal(
          rawAmqpMessage.messageAnnotations!["propMsgAnnotate"],
          testMessage.messageAnnotations!["propMsgAnnotate"],
          "Unexpected messageAnnotations on the received message",
        );
        should.equal(
          rawAmqpMessage.bodyType,
          testMessage.bodyType,
          "Unexpected bodyType on the AmqpAnnotatedMessage",
        );
        assert.deepEqual(
          rawAmqpMessage.applicationProperties,
          testMessage.applicationProperties,
          "Unexpected applicationProperties on the AmqpAnnotatedMessage",
        );
        assert.deepEqual(
          rawAmqpMessage.footer,
          testMessage.footer,
          "Unexpected footer on the AmqpAnnotatedMessage",
        );
        assert.deepEqualExcluding(
          rawAmqpMessage.header!,
          testMessage.header!,
          ["deliveryCount"],
          "Unexpected header on the AmqpAnnotatedMessage",
        );
        assert.deepEqualExcluding(
          rawAmqpMessage.properties!,
          testMessage.properties!,
          ["creationTime", "absoluteExpiryTime", "groupId"],
          "Unexpected properties on the AmqpAnnotatedMessage",
        );
        assert.equal(
          rawAmqpMessage.properties!.groupId,
          testMessage.properties!.groupId,
          "Unexpected session-id on the AmqpAnnotatedMessage",
        );
      }

      it(
        anyRandomTestClientType + ": send, receive, verify props, and complete()",
        async function (): Promise<void> {
          const testMessage: AmqpAnnotatedMessage = getSampleAmqpAnnotatedMessage();
          testMessage.properties = {
            ...testMessage.properties,
            groupId: entityNames().usesSessions ? sessionId : undefined,
          };
          await sender().sendMessages(testMessage);
          await receiveMsg(testMessage);

          await testPeekMsgsLength(receiver(), 0);
        },
      );
    });

    it(
      anyRandomTestClientType +
        ": timeToLive should be set based on absolute_expiry_time and queue default",
      async function (): Promise<void> {
        const ttl = 100 * 24 * 60 * 60 * 1000; // 100 days
        const testMessage: AmqpAnnotatedMessage = {
          body: `test timeToLive`,
          bodyType: "data",
          header: {
            timeToLive: ttl,
          },
          ...getSessionProperties(),
        };

        await sender().sendMessages(testMessage);
        const msgs = await receiver().receiveMessages(1);

        assert.equal(Array.isArray(msgs), true, "`ReceivedMessages` is not an array");
        assert.equal(msgs.length, 1, "Unexpected number of messages");

        assert.equal(msgs[0]._rawAmqpMessage.header?.timeToLive, ttl);
        assert.ok(
          msgs[0]._rawAmqpMessage.properties,
          "Expecting valid 'msgs[0]._rawAmqpMessage.properties'",
        );
        const { absoluteExpiryTime, creationTime } = msgs[0]._rawAmqpMessage.properties!;
        assert.ok(creationTime, "Expecting valid 'creationTime'");
        assert.equal(creationTime! + ttl, absoluteExpiryTime);
      },
    );

    describe("AMQP body type encoding/decoding", () => {
      // Messaging format (describes the three types of encodable entities - 'data', 'sequence' or 'value')
      // http://docs.oasis-open.org/amqp/core/v1.0/csprd01/amqp-core-messaging-v1.0-csprd01.html#type-data

      // Primitive types
      // http://docs.oasis-open.org/amqp/core/v1.0/csprd01/amqp-core-types-v1.0-csprd01.html#toc
      describe("amqp encoding/decoding", () => {
        it("values", async () => {
          const valueTypes = [[1, 2, 3], 1, 1.5, "hello", { hello: "world" }];

          for (const valueType of valueTypes) {
            await sender().sendMessages({
              body: valueType,
              bodyType: "value",
              ...getSessionProperties(),
            });

            const messages = await receiver().receiveMessages(1);
            const message = messages[0];

            assert.deepEqual(
              message._rawAmqpMessage.bodyType,
              "value",
              `Should be identified as a value: ${valueType.toString()}`,
            );
            assert.deepEqual(
              message.body,
              valueType,
              `Deserialized body should be equal: : ${valueType.toString()}`,
            );
          }
        });

        it("sequences", async () => {
          const sequenceTypes = [
            [[1], [2], [3]],
            [1, 2, 3],
          ];

          for (const sequenceType of sequenceTypes) {
            await sender().sendMessages({
              body: sequenceType,
              bodyType: "sequence",
              ...getSessionProperties(),
            });

            const messages = await receiver().receiveMessages(1);
            const message = messages[0];

            assert.deepEqual(
              message._rawAmqpMessage.bodyType,
              "sequence",
              `Should be identified as sequence: ${sequenceType.toString()}`,
            );
            assert.deepEqual(
              message.body,
              sequenceType,
              `Deserialized body should be equal: : ${sequenceType.toString()}`,
            );
          }
        });

        it("data", async () => {
          const buff = Buffer.from("hello", "utf8");

          const dataTypes = [1, 1.5, "hello", { hello: "world" }, buff, [1, 2, 3]];

          for (const dataType of dataTypes) {
            await sender().sendMessages({
              body: dataType,
              bodyType: "data",
              ...getSessionProperties(),
            });

            const messages = await receiver().receiveMessages(1);
            const message = messages[0];

            assert.deepEqual(
              message._rawAmqpMessage.bodyType,
              "data",
              `Should be identified as data: ${dataType.toString()}`,
            );
            assert.deepEqual(
              message.body,
              dataType,
              `Deserialized body should be equal: : ${dataType.toString()}`,
            );
          }
        });

        (
          [
            ["sequence", [1, 2, 3]],
            ["value", "hello"],
            ["data", "hello"],
          ] as ["sequence" | "data" | "value", any][]
        ).forEach(([expectedBodyType, expectedBody]) => {
          it("receive ServiceBusMessage and resend", async () => {
            // if we receive a message that was encoded to a non-data section
            // and then re-send it (again, as a ServiceBusMessage) we should
            // respect it.
            await sender().sendMessages({
              body: expectedBody,
              bodyType: expectedBodyType,
              ...getSessionProperties(),
            });

            const messages = await receiver().receiveMessages(1);
            const message = messages[0];

            assert.equal(message._rawAmqpMessage.bodyType, expectedBodyType);

            // now let's just resend it, unaltered
            await sender().sendMessages(message);

            const reEncodedMessages = await receiver().receiveMessages(1);
            const reEncodedMessage = reEncodedMessages[0];

            assert.equal(reEncodedMessage._rawAmqpMessage.bodyType, expectedBodyType);
            assert.deepEqual(reEncodedMessage.body, expectedBody);
          });
        });
      });
    });

    function getSessionProperties(): { properties?: { groupId: string } } {
      if (entityNames().usesSessions) {
        return {
          properties: {
            groupId: sessionId,
          },
        };
      }

      return {};
    }

    it("scheduleMessages", async () => {
      const amqpAnnotatedMessage: AmqpAnnotatedMessage = {
        body: "hello",
        bodyType: "value",
        ...getSessionProperties(),
      };

      await sender().scheduleMessages(amqpAnnotatedMessage, new Date());

      const messages = (await receiver().receiveMessages(1)).map((m) => m._rawAmqpMessage);

      assert.deepEqual(
        messages.map((m) => ({ body: m.body, bodyType: m.bodyType })),
        [
          {
            body: "hello",
            bodyType: "value",
          },
        ],
      );
    });
  });
});
