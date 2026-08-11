import React from 'react';
import { Metadata } from 'next';
import GeneratedHeaderView from '../../views/header';
import GeneratedSessionAnalyticsDashboardLinkView from '../../views/session_analytics_dashboard_link';
import GeneratedAdminDashboardMenuView from '../../views/admin_dashboard_menu';
import GeneratedSessionMetadataTrackerView from '../../views/session_metadata_tracker';
import GeneratedFooterMenuView from '../../views/footer_menu';
import GeneratedSocialMediaBarView from '../../views/social_media_bar';
import GeneratedCopyrightView from '../../views/copyright';

export const metadata: Metadata = { title: "Session Analytics", description: "Track and analyze chat session metadata and statistics" };

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
                        <div className="h-full w-full col-span-12 md:col-span-12 lg:col-span-12" style={{ backgroundColor: 'transparent', paddingLeft: '25px', paddingTop: '12px', paddingBottom: '8px', marginTop: '8px', marginBottom: '8px' }}>
                            <GeneratedSessionAnalyticsDashboardLinkView isContainer={false} />
                        </div>
                    </div>

                    <div className="h-full grid grid-cols-12 relative">
                        <div className="h-full w-full col-span-12 md:col-span-3 lg:col-span-2" style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '24px', paddingBottom: '24px', marginLeft: '20px', marginTop: '60px', borderTopWidth: '1px', borderTopStyle: 'solid', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderLeftWidth: '1px', borderLeftStyle: 'solid', borderRightWidth: '1px', borderRightStyle: 'solid', borderColor: '#e5e7eb', borderRadius: '8px', alignContent: 'start', textAlign: 'left' }}>
                            <GeneratedAdminDashboardMenuView />
                        </div>
                        <div className="h-full w-full col-span-12 md:col-span-9 lg:col-span-10" style={{ marginTop: '25px', marginBottom: '25px', alignContent: 'start', textAlign: 'left' }}>
                            <GeneratedSessionMetadataTrackerView />
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
