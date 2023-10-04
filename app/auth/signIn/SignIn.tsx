"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ClientSigninForm from "@/app/auth/components/ClientSigninForm";
import BloodBankSigninForm from "@/app/auth/components/BloodBankSigninForm";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const SignIn = () => {
  const { push } = useRouter();

  const currentView = (useSearchParams().get("view") || "BloodRecipient") as string;
  
  const handleUrlChange = (goTo: string) => {
    push(`?view=${goTo}`)
  }
  return (
    <Tabs defaultValue={`${currentView}`} className="w-full mt-8 relative z-[3]">
      <TabsList>
        <TabsTrigger value="BloodRecipient" className="!uppercase !bg-white data-[state=active]:!bg-[#BE382A] !text-zinc-500 data-[state=active]:!text-white !font-LatoRegular !font-semibold tracking-[3px]" onClick={() =>handleUrlChange("BloodRecipient")}>Blood Recipient</TabsTrigger>
        <TabsTrigger value="BloodBank" className="!uppercase !bg-white data-[state=active]:!bg-[#BE382A] !text-zinc-500 data-[state=active]:!text-white !font-LatoRegular !font-semibold tracking-[3px]" onClick={() =>handleUrlChange("BloodBank")}>Blood Bank</TabsTrigger>
      </TabsList>
      <TabsContent value="BloodRecipient">
        <div className="w-full min-h-[80vh] flex items-center justify-center border border-zinc-300 rounded-md shadow-md bg-white overflow-hidden">
          <ClientSigninForm />
        </div>
      </TabsContent>
      <TabsContent value="BloodBank">
        <div className="w-full min-h-[80vh] flex items-center justify-center border border-zinc-300 rounded-md shadow-md bg-white overflow-hidden">
          <BloodBankSigninForm />
        </div>
      </TabsContent>
    </Tabs>

  )
};

export default SignIn;
