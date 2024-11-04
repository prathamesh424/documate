import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
export default function Component() {
  return (
    <div className="bg-white w-screen h-screen">
        <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6 ">Chrome Extension Installation Guide</h1>
      <div className="space-y-6">
        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Step 1: Download ZIP File</CardTitle>
          </CardHeader>
          <CardContent >
            <p className="mb-4">Download the extension ZIP file from the provided Google Drive link.</p>
            <Button  variant="primary" className="w-full border border-xl shadow-lg" >
              <ExternalLink className="mr-2 h-4 w-4" />
              <a href="https://drive.google.com/file/d/1KTgi3ybh1gXnzDAb-3QSmaWvH_3kC2ev/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                Download ZIP
              </a>
            </Button>
          </CardContent> 
        </Card>

        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Step 2: Extract and Open Extensions Page</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Extract the downloaded ZIP file. Then, in your Chrome browser, navigate to:</p>
            <code className="block bg-gray-200 p-2 rounded mt-2">chrome://extensions/</code>
          </CardContent>
        </Card>

        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Step 3: Enable Developer Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <p>On the extensions page, click to enable "Developer mode" in the top right corner.</p>
            <Image
              src="/assets/developer_mode.gif"
              alt="Extension configuration"
              width={400}
              height={200}
              className="rounded-lg border w-full"
            />
          </CardContent>
        </Card>

        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Step 4: Load the Extension</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Click on "Load unpacked" and select the folder you extracted from the ZIP file.</p>
            <Image
              src="/assets/load_unpacked.jpg"
              alt="Extension configuration"
              width={400}
              height={200}
              className="rounded-lg border w-full"
            />
          </CardContent>
        </Card>

        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Step 5: Configure the Extension</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">As shown in the image below, fill in your email and turn on the switch to start tracking.</p>
            <Image
              src="/assets/extension.gif"
              alt="Extension configuration"
              width={400}
              height={200}
              className="rounded-lg border w-full"
            />
          </CardContent>
        </Card>

        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Step 6: View Memory and Generate Docs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You can now view the memory and generate docs from:</p>
            <Button variant="ghost" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              <a href="https://documateit.vercel.app/" target="_blank" rel="noopener noreferrer">
              https://documateit.vercel.app/
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}