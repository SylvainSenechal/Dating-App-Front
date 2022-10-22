import { envData } from './../App';

const STATUS_OK = 200

const get = async (url, jwtToken) => {
  const getResult = await fetch(`${envData.apiURL}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
      'Trace': generateTraceID()
    },
  })
  const readableResult = await getResult.json()

  console.log("url ", url)
  console.log('get response code : ' + readableResult.code)
  console.log('get response message : ' + readableResult.message)
  console.log('get response data : ' + readableResult.data)
  if (getResult.status === STATUS_OK) {
    return readableResult.data
  }
  throw `Get request error : code=${readableResult.code}, message=${readableResult.message}, data=${readableResult.data}`
}

const post = async (url, jwtToken, data) => {
  const postResult = await fetch(`${envData.apiURL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
      'Trace': generateTraceID()
    },
    body: JSON.stringify(data)
  })
  const readableResult = await postResult.json()

  console.log('post response code : ' + readableResult.code)
  console.log('post response message : ' + readableResult.message)
  console.log('post response data : ' + readableResult.data)
  if (postResult.status === STATUS_OK) {
    return readableResult.data
  }
  throw `Post request error : code=${readableResult.code}, message=${readableResult.message}, data=${readableResult.data}`
}

const put = async (url, jwtToken, data) => {
  const postResult = await fetch(`${envData.apiURL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
      'Trace': generateTraceID()
    },
    body: JSON.stringify(data)
  })
  const readableResult = await postResult.json()

  console.log('put response code : ' + readableResult.code)
  console.log('put response message : ' + readableResult.message)
  console.log('put response data : ' + readableResult.data)
  if (postResult.status === STATUS_OK) {
    return readableResult.data
  }
  throw `Put request error : code=${readableResult.code}, message=${readableResult.message}, data=${readableResult.data}`
}

const deleteReq = async (url, jwtToken, data) => {
  const postResult = await fetch(`${envData.apiURL}${url}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
      'Trace': generateTraceID()
    },
    body: JSON.stringify(data)
  })
  const readableResult = await postResult.json()

  console.log('delete response code : ' + readableResult.code)
  console.log('delete response message : ' + readableResult.message)
  console.log('delete response data : ' + readableResult.data)
  if (postResult.status === STATUS_OK) {
    return readableResult.data
  }
  throw `Delete request error : code=${readableResult.code}, message=${readableResult.message}, data=${readableResult.data}`
}

const generateTraceID = () => Math.floor(Math.random() * Math.pow(2, 63)) + 1

export { get, post, put, deleteReq };