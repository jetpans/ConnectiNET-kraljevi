

class dataController {
    constructor() {

    }

    GetData(path) {
        return fetch(path,
            {
                method: 'GET',
                headers: {
                    // TODO: Add authorization headers in standardized file
                    'Content-Type': 'application/json'
                }
            })
            .then(handleRequest)
            .then(data => {
                return Promise.resolve({success: true, data: data});
            }).catch(err => {
                return Promise.reject({success: false, error: err});
            }).finally(() => {});
    }

    PostData(path, data) {        
        return fetch(path,
            {
                method: 'POST',
                headers: {
                    // TODO: Add authorization headers in standardized file
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(handleRequest)
            .then(data => {
                return Promise.resolve({success: true, data: data});
            }).catch(err => {
                return Promise.reject({success: false, error: err});
            }).finally(() => {});
    }
}

async function handleRequest(response) {
    const text = await response.text();
    const data = text && JSON.parse(text);

    if (!response.ok) {
        if (response.status === 401) {
            // TODO: auto logout if 401 response returned from api
            // logout();
            window.location.reload(true);
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }

    return data;
}

export default dataController; 