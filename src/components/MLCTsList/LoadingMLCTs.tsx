import { Commet } from 'react-loading-indicators';

export default function LoadingMLCTs() {
  return (
    <div className="flex p-4 rounded-xl justify-center items-center flex-1">
      <div className="flex flex-1 flex-col gap-4 container mx-auto p-4 justify-center items-center">
        <Commet
          color="#976cff"
          size="small"
          text=""
          textColor=""
          style={{ fontSize: '10px', color: '#976cff' }}
        />
      </div>
    </div>
  );
}
