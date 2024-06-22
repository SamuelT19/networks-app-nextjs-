"use client"
import React from 'react';
import { useRouter } from 'next/router';
import { useProgramsContext } from '@/context/ProgramsContext';
import { Box } from '@mui/material';
import AdminNav from '@/components/admin/AdminNav';
import AdminMenu from '@/components/admin/AdminMenu';
import { UserWithRole } from '@/context/types';

const WithAuth = (WrappedComponent:any, title:string) => {
  return (props:any) => {
    const { state } = useProgramsContext();
    const { user } = state;
    const router = useRouter();

    if (!user) {
      if (typeof window !== 'undefined') {
        router.push('/login');
      }
      return null;
    }

    return (
      <>
        <Box>
          <AdminNav title={title} />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <AdminMenu />
          <Box sx={{ flex: 1, margin: '10px 30px' }}>
            <WrappedComponent {...props} user={user} />
          </Box>
        </Box>
      </>
    );
  };
};

export default WithAuth;
