import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ClientSignupForm from "@/app/auth/components/ClientSignupForm";

const ClientSignUp = () => {
  return (
    <Tabs defaultValue="BloodRecipient" className="w-full mt-8 relative z-[3]">
      <TabsList>
        <TabsTrigger value="BloodRecipient" className="!uppercase !bg-white data-[state=active]:!bg-[#BE382A] !text-zinc-500 data-[state=active]:!text-white !font-LatoRegular tracking-[5px]">Blood Recipient</TabsTrigger>
        <TabsTrigger value="BloodBank" className="!uppercase !bg-white data-[state=active]:!bg-[#BE382A] !text-zinc-500 data-[state=active]:!text-white !font-LatoRegular tracking-[5px]">Blood Bank</TabsTrigger>
      </TabsList>
      <TabsContent value="BloodRecipient">
        <div className="w-full min-h-[80vh] border border-zinc-300 rounded-md shadow-md bg-white overflow-hidden flex justify-center items-center">
          <ClientSignupForm />
        </div>
      </TabsContent>
      <TabsContent value="BloodBank">
        <div className="w-full min-h-[80vh] border border-zinc-300 rounded-md shadow-md bg-white overflow-hidden">

        </div>
      </TabsContent>
    </Tabs>

  )
};

export default ClientSignUp;
