import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ClientSigninForm from "@/app/auth/components/ClientSigninForm";
import TestRedux from "../components/TestRedux";
import TestReduxUse from "../components/TestReduxUse";

const ClientSignIn = () => {
  return (
    <Tabs defaultValue="BloodRecipient" className="w-full mt-8 relative z-[3]">
      <TabsList>
        <TabsTrigger value="BloodRecipient" className="!uppercase !bg-white data-[state=active]:!bg-[#BE382A] !text-zinc-500 data-[state=active]:!text-white !font-LatoRegular !font-semibold tracking-[3px]">Blood Recipient</TabsTrigger>
        <TabsTrigger value="BloodBank" className="!uppercase !bg-white data-[state=active]:!bg-[#BE382A] !text-zinc-500 data-[state=active]:!text-white !font-LatoRegular !font-semibold tracking-[3px]">Blood Bank</TabsTrigger>
      </TabsList>
      <TabsContent value="BloodRecipient">
        <div className="w-full min-h-[80vh] flex items-center justify-center border border-zinc-300 rounded-md shadow-md bg-white overflow-hidden">
          <ClientSigninForm />
        </div>
      </TabsContent>
      <TabsContent value="BloodBank">
        <div className="w-full min-h-[80vh] border border-zinc-300 rounded-md shadow-md bg-white overflow-hidden">
          <TestRedux />
          <TestReduxUse />
        </div>
      </TabsContent>
    </Tabs>

  )
};

export default ClientSignIn;
