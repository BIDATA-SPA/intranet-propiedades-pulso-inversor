import Header from '@/components/template/Header'
import HeaderLogo from '@/components/template/HeaderLogo'
import HorizontalNav from '@/components/template/HorizontalNav'
import MobileNav from '@/components/template/MobileNav'
import SidePanel from '@/components/template/SidePanel'
import View from '@/views'


const HeaderActionsStart = () => {
    return (
        <>
            <HeaderLogo />
            <MobileNav />

        </>
    )
}


const HeaderActionsEnd = () => {
    return (
        <>
           
            <SidePanel />
            {/* <UserDropdown hoverable={false} /> */}
        </>
    )
}

const SimpleLayout = () => {
    return (
        <div className="app-layout-simple flex flex-auto flex-col min-h-screen">
            <div className="flex flex-auto min-w-0">
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        container
                        className="shadow dark:shadow-2xl"
                        headerStart={<HeaderActionsStart />}
                        headerMiddle={<HorizontalNav />}
                        headerEnd={<HeaderActionsEnd />}
                    />
                    <View pageContainerType="contained" />
                </div>
            </div>
        </div>
    )
}

export default SimpleLayout
