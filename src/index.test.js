import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import useAxiosProgressBar from "./index";
import { renderHook, act, cleanup } from "@testing-library/react-hooks";

const mockAdapterInstance = new MockAdapter( axios, { delayResponse: 100 });

mockAdapterInstance.onGet( "/ok" ).reply( config => {
    config.onUploadProgress({ loaded: 1, total: 1 });
    return [ 200, "OK" ];
});

mockAdapterInstance.onGet( "/20" ).reply( config => {
    config.onDownloadProgress({ loaded: 20, total: 100 });
    return [ 200, "OK" ];
});

const sleep = ms => new Promise( resolve => setTimeout( resolve, ms ));

test( "equals -1 on initial render", () => {
    const p = renderHook(() => useAxiosProgressBar({ delay: 10 }));
    expect(p.result.current).toBe(-1);
});

test( "equals 0 when axios starts loading", () => {
    expect.assertions( 1 );
    const p = renderHook(() => useAxiosProgressBar({ delay: 10 }));
    act(() => {
        axios.get( "/ok" );
    });
    return sleep( 20 ).then(() => expect(p.result.current).toBe( 0 ));
});

test( "equals 20 when loaded 20/100", () => {
    expect.assertions( 1 );
    const p = renderHook(() => useAxiosProgressBar({ delay: 10 }));
    act(() => {
        axios.get( "/20" );
    });
    return sleep( 25 ).then(() => expect(p.result.current).toBe( 20 ));
})