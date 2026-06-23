import { useQuery } from '@tanstack/react-query'
import { conversation } from 'models/conversation'
import { getConversations } from '@/services/apiService'
import { chatQueryKeys } from './chatQueryKeys'


export const useConversations = () => {
  const query = useQuery({
    queryKey: chatQueryKeys.conversations,
    queryFn: getConversations,
    staleTime: 15_000
  })

  const conversations: conversation[] =
    (query.data ?? []).map((item) => ({
      ...item,
    })); 
   
  return {
    conversations,
    isLoadingConversations: query.isLoading,
    isFetchingConversations: query.isFetching,
    refetchConversations: query.refetch
  }
}
