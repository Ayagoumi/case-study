import { useQuery } from '@apollo/client';

import { GET_TICK_DETAIL } from '../apollo/queries';

const useTickDetail = (tickID: string) => {
  const { data, loading } = useQuery(GET_TICK_DETAIL, {
    variables: { id: tickID },
  });

  return {
    tickDetail: data ? data.tick : null,
    loading,
  };
};

export default useTickDetail;
