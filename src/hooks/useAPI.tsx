import useAxios from '@/lib/interceptor';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
export const useGet = (key: string, url: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const response = await axios.get(url);
      return response.data;
    },
    staleTime: 10000
  });
};

// const { data, isLoading, error } = useGet('items', '/api/items');

export const usePost = (endpoint: string, options?: UseMutationOptions) => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async (variables) => {
      const response = await axios.post(endpoint, variables);
      return response.data;
    },
    ...options
  });
};

//  const {
//    mutate: addItem,
//    isLoading,
//    error,
//  } = usePost('/api/items', {
//    onSuccess: () => {
//      console.log('Item added successfully');
//      // Optionally, refetch the items list or handle success state
//    },
//    onError: (error) => {
//      console.error('Error adding item:', error);
//    },
//  });

//addItem({ name });

export const useDelete = (
  endpoint: string,
  id: number | string,
  options?: UseMutationOptions
) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(`${endpoint}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
    ...options
  });
};

//  const {
//    mutate: deleteItem,
//    isLoading,
//    error,
//  } = useDelete('/api/items', id, {
//    onSuccess: () => {
//      console.log('Item deleted successfully');
//    },
//    onError: (error) => {
//      console.error('Error deleting item:', error);
//    },
//  });

export const useEdit = (
  endpoint: string,
  id: number | string,
  options?: UseMutationOptions
) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: async (variables) => {
      const response = await axios.put(`${endpoint}/${id}`, variables);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
    ...options
  });
};

//  const {
//    mutate: editItem,
//    isLoading,
//    error,
//  } = useEdit('/api/items', id, {
//    onSuccess: () => {
//      console.log('Item updated successfully');
//    },
//    onError: (error) => {
//      console.error('Error updating item:', error);
//    },
//  });
