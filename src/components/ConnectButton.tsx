import { Commet } from 'react-loading-indicators';

const buttonClass =
  'min-w-[80px] h-[38px] inline-block rounded-full bg-neutral-800 px-6 py-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]';

export default function ConnectButton({
  isConnecting,
  isConnected,
  modalOpen,
  openModal,
  disconnect,
}: {
  isConnecting: boolean;
  isConnected: boolean;
  modalOpen: boolean;
  openModal: () => void;
  disconnect: () => void;
}) {
  if (modalOpen && isConnecting) {
    return (
      <button onClick={openModal} className={buttonClass}>
        <Commet
          color="#976cff"
          size="small"
          text=""
          textColor=""
          style={{ fontSize: '3px', color: '#976cff' }}
        />
      </button>
    );
  }

  return (
    <button onClick={isConnected ? disconnect : openModal} className={buttonClass}>
      {isConnected ? 'Disconnect' : 'Connect'}
    </button>
  );
}
