# use-axios-progress-bar react hook

1. `yarn add use-axios-progress-bar` or `npm i use-axios-progress-bar --save`
2. Find the progress bar component of your dream
3. Use it
```javascript
//import your axios instance(or just global axios)
import TrackedAxiosInstance from "axios";
import useAxiosProgressBar from "use-axios-progress-bar";

/*
    In DELAY ms minimum after query sent progress will start moving on(smth like throttling to avoid frequent irritating twitches)
*/
const DELAY = 200;

const GlobalProgressBar = () => {
    const currentProgress = useAxiosProgressBar( TrackedAxiosInstance, DELAY );

    /*
        -1: no activity
        0: smth is running, but exact loading/total ratio cannot be calculated
        1-100: smth is running and loading/total ratio is known
    */
    
    return (
        <div>Current state: ${currentProgress}</div>
    );
}
```
4. Or something more usable and beautiful
```javascript
import Axios from "axios";
import useAxiosProgressBar from "use-axios-progress-bar";
import LinearProgress from "@material-ui/core/LinearProgress";
import { css } from "@emotion/core";

/* Overprioriting MUI styles with && */
const fixedProgressBarCss = css`
    &&{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
    }   
`

const AxiosProgressIndicator = () => {

    const loaded = useAxiosProgressBar( Axios );

    return (
        <LinearProgress
            css={fixedProgressBarCss}
            value={loaded<1?loaded+1:loaded}
            variant={loaded>0?"determinate":"indeterminate"}
        />
    )
}
```
5. Profit!