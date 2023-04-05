import React from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'

import Video from '@/components/ui/Video'

function VideoPage() {
    const router = useRouter()
    const { id } = router.query as { id: string }

    return <Video id={id} />
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    return {
        props: { query: context.query }
    }
}


export default VideoPage