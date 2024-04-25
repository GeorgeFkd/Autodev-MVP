

import React from 'react'
import { Grid } from '@chakra-ui/react'
function Container({ children }: { children: React.ReactNode } | { children: React.ReactNode[] }) {
    return (
        <Grid w={"100vw"} placeItems={"center"} h="100vh" gridRowGap="1rem" paddingTop="1rem">
            {children}
        </Grid>
    )
}

export default Container