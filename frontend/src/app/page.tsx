import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
       <h1 className="mb-10">Gopher</h1>
       <Image src="/gopher.png" alt="gopher" width={200} height={200}></Image>
    </div>
  );
}
