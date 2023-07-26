import { Can } from "@/components/Can";
import { QueryProviderContainer } from "@/components/QueryProviderContainer";
import { ReactNode } from "react";


export default function RootLayout({ children }: { children: ReactNode }) { 
  return (
    <QueryProviderContainer>
      <Can permissions={['view_dashboard']} to='/unauthorized'>
        {children}
      </Can>
    </QueryProviderContainer>
  )
}