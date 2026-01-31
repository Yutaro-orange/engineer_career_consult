import Link from "next/link";

export default function Home() {
    return (
        <>
            <h1>エンジニアキャリア診断</h1>
            <p>あなたのキャリアを診断します</p>
            <Link href="/consult">診断する</Link>
        </>
    );
}