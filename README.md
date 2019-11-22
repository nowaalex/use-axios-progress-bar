# use-axios-progress-bar react hook

1. `yarn add use-axios-progress-bar` or `npm i use-axios-progress-bar --save`
2. Find the progress bar component of your dream
3. Use it
```javascript
import useAxiosProgressBar from "use-axios-progress-bar";

const GlobalProgressBar = () => {
    const currentProgress = useAxiosProgressBar();

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
import Axios from "axiosInstance";
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
`;

const AxiosProgressIndicator = () => {

    const loaded = useAxiosProgressBar({
        axiosInstance: Axios,
        delay: 500
    });

    return loaded === -1 ? null : (
        <LinearProgress
            css={fixedProgressBarCss}
            value={loaded}
            variant={loaded>0?"determinate":"indeterminate"}
        />
    );
}
```
5. Profit!