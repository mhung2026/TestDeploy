import React from 'react';

class ResultTable extends React.Component {
    render() {
        const { selectedLocation } = this.props;

        if (!selectedLocation) {
            return;
        }

        const { provinceName, districtName, wardName } = selectedLocation;

        return (
            <div>
                <h2>Selected Location</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Province</th>
                            <th>District</th>
                            <th>Ward</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{provinceName || 'N/A'}</td>
                            <td>{districtName || 'N/A'}</td>
                            <td>{wardName || 'N/A'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ResultTable;
