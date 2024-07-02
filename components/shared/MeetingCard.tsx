import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const MeetingCard = ({ bg, children, icon, title, content }: { bg: string, children: any, onClick: any, icon: string, title: string, content: string }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div
          className={`cursor-pointer ${bg} px-4 py-8 flex flex-col justify-around w-full min-h-[250px] rounded-2xl lg:hover:scale-105 xl:hover:scale-110 transition-transform hover:shadow-xl`}>
          <img src={icon} height={30} width={30} alt={title} />
          <h2>{title}</h2>
          <p>{content}</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        {children}
        
      </DialogContent>
    </Dialog>


  )
}

export default MeetingCard