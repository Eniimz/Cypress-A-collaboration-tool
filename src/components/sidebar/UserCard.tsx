
import { Avatar, AvatarImage } from '../ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { Ghost, LogOutIcon, MoonIcon } from 'lucide-react'
import { useSupabaseContext } from '@/lib/providers/supabaseUserProvider'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/lib/providers/state-provider'
import CypressProfileIcon from '../icons/cypressProfileIcon'
import { subscription } from '@/lib/supabase/supabase.types'
import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import LogOut from '../global/LogOut'
import db from '@/lib/supabase/db'
import ModeToggle from '../global/mode-toggle'

type UserCardProps = {
    subscription: subscription | null;
}

const UserCard: React.FC<UserCardProps> = async ({ subscription }) => {

    const supabase = createServerComponentClient({ cookies })

    const { data: { user } } = await supabase.auth.getUser()

    if(!user) return

    const dbUser = await db.query.users.findFirst({
        where: (u, {eq}) => eq(u.id, user.id)
    })

  return (
    <div className='flex items-center dark:bg-Neutrals/neutrals-12 p-2 
    gap-1 rounded-3xl'>
        <div className=''>
            <Avatar className='flex items-center justify-center'>
                <AvatarImage src={dbUser?.avatarUrl || ''} />
                <AvatarFallback>
                    <CypressProfileIcon />
                </AvatarFallback>
            </Avatar>
        </div>

        <div className='flex items-center gap-7'>
            <div className='flex flex-col'>
                <p className='text-muted-foreground'>
                    {subscription?.status !== 'active' ? 'Free Plan' : 'Pro Plan'}
                </p>
                <small className='w-[100px]'>
                    {user?.email && user.email.length > 20 ? user.email.substring(0, 14) + '...' : user?.email }
                    </small>
            </div>

            <div className='flex justify-center items-center gap-1  '>

                <LogOut>
                    <LogOutIcon size={33}/>
                </LogOut>    

                <ModeToggle />

            </div>
        </div>
    </div>
  )
}

export default UserCard