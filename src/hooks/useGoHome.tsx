import { useAppContext } from "@/contexts/AppContext";
import { AppContext } from "@/types/types";
import { useRouter } from "next/navigation";

export function useGoHome({ condition }: { condition: (ctx: AppContext) => boolean }) {
    const router = useRouter();
    const appContext = useAppContext();
    if (appContext == null || condition(appContext)) {
        console.log("Rerouting to home page...")
        router.replace("/");
    }
}