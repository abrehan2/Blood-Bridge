"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ClientSignupForm from "@/app/auth/components/ClientSignupForm";
import BloodBankSignupForm from "@/app/auth/components/BloodBankSignupForm";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const { push } = useRouter();

  const currentView = (useSearchParams().get("view") || "BloodRecipient") as string;
  
  const handleUrlChange = (goTo: string) => {
    push(`?view=${goTo}`)
  }
  return (
    <Tabs defaultValue={`${currentView}`} className="w-full mt-8 relative z-[3]">
      <TabsList>
        <TabsTrigger value="BloodRecipient" className="!uppercase !bg-white data-[state=active]:!bg-[#BE382A] !text-zinc-500 data-[state=active]:!text-white !font-LatoRegular tracking-[5px]" onClick={() =>handleUrlChange("BloodRecipient")}>Blood Recipient</TabsTrigger>
        <TabsTrigger value="BloodBank" className="!uppercase !bg-white data-[state=active]:!bg-[#BE382A] !text-zinc-500 data-[state=active]:!text-white !font-LatoRegular tracking-[5px]" onClick={() =>handleUrlChange("BloodBank")}>Blood Bank</TabsTrigger>
      </TabsList>
      <TabsContent value="BloodRecipient">
        <div className="w-full py-16 border border-zinc-300 rounded-md shadow-md bg-white overflow-hidden flex justify-center items-center">
          <ClientSignupForm />
        </div>
      </TabsContent>
      <TabsContent value="BloodBank">
        <div className="w-full py-16 min-h-[80vh] border border-zinc-300 rounded-md shadow-md bg-white overflow-hidden">
          <BloodBankSignupForm />
        </div>
      </TabsContent>
    </Tabs>

  )
};

export default SignUp;
