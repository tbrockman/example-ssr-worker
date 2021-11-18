/** @jsx jsx */
import { jsx } from '@emotion/react'
import styled from '@emotion/styled'

const MyDiv = styled('div')({ fontSize: 12 })

type AppProps = {
    text: string
}

export default function App({ text }: AppProps) {
    
    return (
        <MyDiv>
            { text }
        </MyDiv>
    )
}