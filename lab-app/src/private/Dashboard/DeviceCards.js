// DeviceCards.js
import React from 'react';

function DeviceCards({ devices }) {
  return (
    <div className="row">
      {devices.map((interfaceItem, interfaceIndex) =>
        interfaceItem.devices.map((device, deviceIndex) => (
          <div key={`${interfaceIndex}-${deviceIndex}`} className="col-12 col-sm-6 col-xl-4 mb-4">
            <div className="card border-0 shadow">
              <div className="card-body">
                <div className="row d-block d-xl-flex align-items-center">
                  <div className="col-12 col-xl-5 text-xl-center mb-3 mb-xl-0 d-flex align-items-center justify-content-xl-center">
                    <div className="icon-shape icon-shape-primary rounded me-4 me-sm-0">
                      {/* Icone do dispositivo */}
                      <svg
                        id="Capa_1"
                        enableBackground="new 0 0 512.099 512.099"
                        viewBox="0 0 512.099 512.099"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          id="_x3C_Group_x3E__12_"
                          d="m451.05 301.099c0-58.692-34.515-113.562-90.827-137.842l13.264-13.454-20.545-21.449 22.288-22.288 21.213 21.213 21.213-21.213-106.066-106.066-21.213 21.213 21.213 21.213-22.215 22.214-21.212-21.214-97.279 97.279 21.213 21.213-42.427 42.426 63.64 63.64 42.426-42.426 15.54 15.541h25.495c32.85 0 60.946 23.613 63.963 53.759 3.678 36.726-25.272 66.241-59.653 66.241l-2.614-.006c-6.194-17.456-22.865-29.994-42.418-29.994-19.486 0-36.113 12.452-42.357 29.815l-38.088-.081c-8.776-.019-16.016-4.873-19.365-12.984-3.35-8.112-1.645-16.659 4.561-22.865l11.461-11.461 13.183 13.183 21.213-21.213-90-90-21.213 21.213 13.182 13.182-15.855 15.854c-20.159 20.159-31.721 48.143-31.721 76.778 0 59.591 48.48 108.174 108.071 108.3l41.929.089v31.191h-30v30h150v-30h-30v-31c82.71-.001 150-67.29 150-150.001zm-118.247-237.459 21.214 21.213-22.244 22.244c-6.925-6.944-14.25-14.281-21.193-21.234zm-119.492 161.919-21.213-21.213 21.213-21.213 21.213 21.213zm63.959-20.893-63.959-63.96"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="col-12 col-xl-7 px-xl-0">
                    <div className="d-flex align-items-center mb-2">
                      <h2 className="h5 me-2">{device.deviceId}</h2>
                      {device.role === "server" ? (
                        <span className="text-success ms-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            fill="currentColor"
                            className="bi bi-box-arrow-in-down"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z"
                            />
                            <path
                              fillRule="evenodd"
                              d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"
                            />
                          </svg>
                        </span>
                      ) : (
                        <span className="text-info ms-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            fill="currentColor"
                            className="bi bi-box-arrow-up"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5.5 0 0 1 2 14.5v-8A1.5.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z"
                            />
                            <path
                              fillRule="evenodd"
                              d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708z"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="mb-1">
                      <span className="fw-bold">
                        {device.ip}:{device.port} | {device.isOnLine}
                      </span>
                    </p>
                    <p className="text-muted small mb-0">{interfaceItem.name}</p>
                    <div className="d-flex justify-content-between mt-3">
                      <div className="text-center">
                        <h6 className="fw-bold text-primary">RP</h6>
                        <span>{interfaceItem.totalResultsProcessed || 0}</span>
                      </div>
                      <div className="text-center">
                        <h6 className="fw-bold text-primary">MRM</h6>
                        <span>{(interfaceItem.averageResultsPerMinute || 0).toFixed(2)}</span>
                      </div>
                      <div className="text-center">
                        <h6 className="fw-bold text-primary">MRD</h6>
                        <span>{(interfaceItem.averageResultsPerDay || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DeviceCards;
