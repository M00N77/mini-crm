import AuthTabs from '../components/auth/AuthTabs'

const AuthLayout = ({children} ) => {
    return(
        <main>
            <div>
                <AuthTabs/>
                {children}
            </div>
        </main>
    )
}

export default AuthLayout;