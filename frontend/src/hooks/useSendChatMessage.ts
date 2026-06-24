import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AIMessage, AIMessageRole } from "models/message";
import { sendChatMessage } from "@/services/apiService";
import { chatQueryKeys } from "./chatQueryKeys";
import { getErrorMessage } from "@/utils/errorCatcher";

type SendChatMessageVariables = {
  message: string;
  conversationId: string | null;
  optimisticConversationId: string;
};

type UseSendChatMessageParams = {
  onConversationResolved: (conversationId: string) => void;
  onConversationFailed: (
    message: string,
    variables: SendChatMessageVariables
  ) => void;
};

export const useSendChatMessage = ({
  onConversationResolved,
  onConversationFailed,
}: UseSendChatMessageParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      message,
      conversationId,
    }: SendChatMessageVariables) => {
      return sendChatMessage({
        conversationId: conversationId ?? undefined,
        message,
      });
    },

    onMutate: async (variables) => {
      const queryKey = chatQueryKeys.messages(
        variables.optimisticConversationId
      );

      await queryClient.cancelQueries({ queryKey });

      const optimisticMessage: AIMessage = {
        conversationId: variables.optimisticConversationId,
        sender: AIMessageRole.User,
        text: variables.message,
        createdAt: new Date(),
      };

      queryClient.setQueryData<AIMessage[]>(
        queryKey,
        (messages = []) => [...messages, optimisticMessage]
      );
    },

    onSuccess: (response, variables) => {
      const optimisticKey = chatQueryKeys.messages(
        variables.optimisticConversationId
      );

      const resolvedConversationId =
        response.conversationId ||
        variables.optimisticConversationId;

      const resolvedKey = chatQueryKeys.messages(
        resolvedConversationId
      );

      const optimisticMessages =
        queryClient.getQueryData<AIMessage[]>(
          optimisticKey
        ) ?? [];

      const migratedMessages =
        optimisticMessages.map((message) => ({
          ...message,
          conversationId: resolvedConversationId,
        }));

      const assistantMessage: AIMessage = {
        conversationId: resolvedConversationId,
        sender: AIMessageRole.Model,
        text: response.message,
        createdAt: new Date(),
      };

      queryClient.setQueryData(
        resolvedKey,
        [...migratedMessages, assistantMessage]
      );

      if (
        resolvedConversationId !==
        variables.optimisticConversationId
      ) {
        queryClient.removeQueries({
          queryKey: optimisticKey,
        });
      }

      onConversationResolved(resolvedConversationId);

      void queryClient.invalidateQueries({
        queryKey: chatQueryKeys.conversations,
      });
    },

    onError: (error, variables) => {
      onConversationFailed(
        getErrorMessage(error),
        variables
      );
    },
  });
};