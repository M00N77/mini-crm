
import {ReactNode} from "react";
import {AppShell} from "@/src/components/layouts/AppShell";

const mainLayout = ({children} :{ children: ReactNode }) => {

    return (
        <AppShell>{children}</AppShell>
    )
}

export default mainLayout;