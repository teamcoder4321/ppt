import React from 'react';
import GeneratedLogoView_ae34ed from './logo';
import GeneratedHeaderMenuView_a6c53a from './header_menu';
import GeneratedHeaderIconBarView_1b184a from './header_icon_bar';
import GeneratedLoginButtonView_c14e00 from './login_button';

export default function GeneratedHeaderView(){
  return (
    <div className="h-full gap-4 grid  grid-flow-col relative" style={{ paddingLeft: '5px', paddingRight: '10px', paddingTop: '12px', paddingBottom: '12px', maxHeight: '100px', borderBottomWidth: '0px', borderBottomStyle: 'solid', borderColor: '#e5e5e5' }}>
            <div className="h-full w-full col-span-8 md:col-span-10 lg:col-span-2" style={{ alignContent: 'center' }}>
              <div className="w-full h-full justify-center items-center">
                <GeneratedLogoView_ae34ed />
              </div>
            </div>
            <div className="h-full w-full col-span-2 md:col-span-1 lg:col-span-8" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '24px', paddingBottom: '24px', textAlign: 'center' }}>
              <div className="w-full h-full justify-center items-center">
                <GeneratedHeaderMenuView_a6c53a />
              </div>
            </div>
            <div className="h-full w-full col-span-1 md:col-span-1 lg:col-span-1" style={{ paddingLeft: '24px', paddingRight: '24px', alignContent: 'center', textAlign: 'right' }}>
              <div className="w-full h-full justify-center items-end">
                <GeneratedHeaderIconBarView_1b184a />
              </div>
            </div>
            <div className="h-full w-full col-span-2 md:col-span-1 lg:col-span-1" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '18px', paddingBottom: '24px', textAlign: 'right' }}>
              <div className="w-full h-full justify-center items-end">
                <GeneratedLoginButtonView_c14e00 />
              </div>
            </div>
    </div>
  );
}