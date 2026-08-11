import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderView from '../views/header';
import GeneratedHeroContentView from '../views/hero_content';
import GeneratedWelcomeToNexusView from '../views/welcome_to_nexus';
import GeneratedFooterMenuView from '../views/footer_menu';
import GeneratedSocialMediaBarView from '../views/social_media_bar';
import GeneratedCopyrightView from '../views/copyright';

export const metadata: Metadata = { title: "Home", description: "Homepage" };

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
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ backgroundColor: 'none', paddingLeft: '5px', paddingRight: '5px', paddingTop: '20px', paddingBottom: '20px', minHeight: '550px', borderBottomWidth: '0px', borderBottomStyle: 'solid', borderColor: '#e5e5e5', alignContent: 'center', textAlign: 'center' }}>
                            <GeneratedHeroContentView />
                        </div>
                    </div>

                    <div className="h-full grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px', alignContent: 'start', textAlign: 'center' }}>
                            <GeneratedWelcomeToNexusView isContainer={false} />
                        </div>
                    </div>

                    <div className="h-full grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '170px', paddingBottom: '30px', maxHeight: '30px', borderTopWidth: '0px', borderTopStyle: 'solid', borderColor: '#e5e5e5', alignContent: 'center', textAlign: 'center' }}>
                            <GeneratedFooterMenuView />
                        </div>
                    </div>

                    <div className="h-full grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '15px', paddingBottom: '5px', textAlign: 'center' }}>
                            <GeneratedSocialMediaBarView />
                        </div>
                    </div>

                    <div className="h-full grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '16px', paddingBottom: '25px', marginTop: '25px', marginBottom: '8px', textAlign: 'center' }}>
                            <GeneratedCopyrightView isContainer={false} />
                        </div>
                    </div>
      </main>
    </div>
  );
}
