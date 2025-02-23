import Banner from "./components/banner"
import Chat from "./components/chat"

function page() {
  return (
    <div className="flex flex-col min-h-screen" >
        <div className="flex-grow" />
        <Banner/>
        <div className="flex-grow" />
        <div className="mx-auto w-5/6">
            <Chat/>
        </div>
    </div>
  )
}

export default page