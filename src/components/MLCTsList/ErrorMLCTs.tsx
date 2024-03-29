export default function ErrorMLCTs({ message }: { message: string }) {
  return (
    <div className="flex p-4 rounded-xl justify-center items-center flex-1">
      <span className="text-red-500">Error fetching pools: {message}</span>
    </div>
  );
}
