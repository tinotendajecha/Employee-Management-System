import Header from "../components/Header";
import PositiveActionButton from '../components/Buttons/PositiveActionButton'
import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <>
            <div className="landing-page">
                <h2 className="headline">Streamline Employee Management and Performance with our Powerful System.</h2>
                <p>Effortlessly manage employee records, leave schedules, performance tracking, and job applications in one centralized platform.</p>

                <div>
                    <Link to='login-as'><PositiveActionButton text="Get started" /></Link>
                </div>
            </div>
        </>
    )
}

export default LandingPage;