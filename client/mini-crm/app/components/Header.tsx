import {Typography} from "@/src/components/atoms/Typography";
import {SearchInput} from "@/src/components/molecules/SearchInput";


const Header = ({className} ) => {
    return (
        <div>
            <div className={className}>
                <Typography as='h2'>Dashboard</Typography>
                <Typography as='p'>Your pipeline at a glance</Typography>
            </div>


        </div>
    )
}

export default Header