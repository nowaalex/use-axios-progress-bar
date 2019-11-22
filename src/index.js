import { useEffect, useState } from "react";

const wrapEvent = ( curEventFn, newEventFn ) => {
    if( curEventFn ){
        return e => {
            curEventFn( e );
            newEventFn( e );
        }
    }

    return newEventFn;
}

const calculateProgress = progressMap => {
    if( !progressMap.size ){
        return -1;
    }

    let total = 0,
        loaded = 0;

    for( const [ k, v ] of progressMap ){
        if( !v.precise ){
            return 0;
        }

        total += ( v.uTotal + v.dTotal );
        loaded += ( v.uLoaded + v.dLoaded );
    }

    return loaded / total * 100 | 0;
}

const useAxiosProgressBar = ( axiosInstance, delay = 200 ) => {

    const [ progress, setProgress ] = useState( -1 );

    useEffect(() => {
        const progressMap = new Map();
        const { request } = axiosInstance.interceptors;
        let firstQueryStartTimestamp = 0,
            progressTimer;

        const requestInterceptor = request.use( config => {

            const id = Math.random() * 1e9 | 0;

            progressMap.set( id, {
                precise: false,
                uLoaded: 0,
                uTotal: 0,
                pLoaded: 0,
                pTotal: 0
            });

            if( progressMap.size === 1 ){
                firstQueryStartTimestamp = performance.now();
            }

            const getProgressUpdateCallback = prefix => ({ total, loaded }) => {
                const p = progressMap.get( id );
                if( p ){
                    p.precise = true;
                    p[ `${prefix}Total` ] = total;
                    p[ `${prefix}Loaded` ] = loaded;
                    
                    const remainingTime = firstQueryStartTimestamp + delay - performance.now();
                    clearTimeout( progressTimer );
                    const curProgress = calculateProgress( progressMap );
                    if( remainingTime <= 0 ){
                        setProgress( curProgress );
                    }
                    else{
                        progressTimer = setTimeout( setProgress, remainingTime, curProgress );
                    }
                }
            }

            config.transformResponse.push(data => {
                if( progressMap.delete( id ) ){
                    clearTimeout( progressTimer );
                    setProgress(calculateProgress(progressMap));
                }
                return data;
            });

            config.onUploadProgress = wrapEvent( config.onUploadProgress, getProgressUpdateCallback( "u" ) );
            config.onDownloadProgress = wrapEvent( config.onDownloadProgress, getProgressUpdateCallback( "d" ) );
            
            return config;
        });

    
        return () => {
            /*
                progressMap will remain in closure after component unmount.
                clearing it prevents setProgress calls inside progressUpdateCallback.
                It is impossible to unattach config.onDownloadProgress/onUploadprogress in clean way.    
            */
            progressMap.clear();
            clearTimeout( progressTimer );
            request.eject( requestInterceptor );
        }
    }, [ axiosInstance, delay ]);

    return progress;
}

export default useAxiosProgressBar;