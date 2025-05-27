import { PropagateLoader } from "react-spinners";

const Spinners = () => {
    return (
        <div className="flex justify-center items-center min-h-[200px]">
            <PropagateLoader
                color="#6366f1"
                size={20}
                loading={true}
                speedMultiplier={0.8}
                aria-label="Loading Movies"
                data-testid="loader"
            />
        </div>
    )
}
export default Spinners
