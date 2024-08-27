import React, { useMemo } from 'react';

/**
 * props:
 * - type
 * - onChange
 */
function Gender(props) {

    /**
     * Binance sumiu com estes tipos:
     * <option value="ICEBERG">Iceberg</option>
     * <option value="STOP_LOSS">Stop Loss</option>
     * <option value="TAKE_PROFIT">Take Profit</option>
     */

    const gender = useMemo(() => {
        return (
            <div className="form-group">
                <label htmlFor="gender">Gender:</label>
                <select id="gender" className="form-select" value={props.gender} onChange={props.onChange}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>
            </div>
        )
    }, [props.gender])

    return gender;
}

export default Gender;