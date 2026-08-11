import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderView from '../../views/header';
import GeneratedLoginviewView from '../../views/loginview';

export const metadata: Metadata = { title: "Login", description: "User login page" };

export default function Page(){
  return (
    <div className="page" style={{ minHeight: '70vh' }}>
      <main>

                    <div className="h-full grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12">
                            <GeneratedHeaderView />
                        </div>
                    </div>

                    <div className="h-full grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '24px', paddingBottom: '24px', textAlign: 'center' }}>
                            <GeneratedLoginviewView />
                        </div>
                    </div>
      </main>
    </div>
  );
}
