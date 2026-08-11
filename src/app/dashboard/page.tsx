import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderView from '../../views/header';
import GeneratedUserDashboardMenuView from '../../views/user_dashboard_menu';
import GeneratedDashboardAnalyticsView from '../../views/dashboard_analytics';
import GeneratedFooterMenuView from '../../views/footer_menu';
import GeneratedSocialMediaBarView from '../../views/social_media_bar';
import GeneratedCopyrightView from '../../views/copyright';

export const metadata: Metadata = { title: "Dashboard", description: "User dashboard page" };

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
                        <div className="h-full w-full col-span-12 md:col-span-3 lg:col-span-2" style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '24px', paddingBottom: '24px', marginLeft: '20px', marginTop: '60px', borderTopWidth: '1px', borderTopStyle: 'solid', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderLeftWidth: '1px', borderLeftStyle: 'solid', borderRightWidth: '1px', borderRightStyle: 'solid', borderColor: '#e5e7eb', borderRadius: '8px', alignContent: 'start', textAlign: 'left' }}>
                            <GeneratedUserDashboardMenuView />
                        </div>
                        <div className="h-full w-full col-span-12 md:col-span-9 lg:col-span-10" style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '20px', paddingBottom: '20px', marginLeft: '10px', marginRight: '10px', alignContent: 'start', textAlign: 'left' }}>
                            <GeneratedDashboardAnalyticsView />
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
