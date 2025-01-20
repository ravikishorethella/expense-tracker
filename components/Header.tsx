import {SignInButton, SignedIn, SignedOut, UserButton} from "@clerk/nextjs"
import { User } from "@clerk/nextjs/server";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
    const user = await checkUser()
    
    return ( <nav className="navbar">
        <div className="navbar-container">
            <h2>Expense Tracker</h2>
            <div>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </div>
    </nav> );
}
 
export default Header;