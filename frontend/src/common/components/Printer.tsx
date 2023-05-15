import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { PrintProps } from '../../../types';
import { loadRefComponent } from '../component';

export const ComponentToPrint = React.forwardRef(({ children }, ref) => {
    return (
        <div ref={ref}>{children}</div>
    );
});

class FastballPrint extends React.PureComponent<PrintProps> {
    render() {
        const { trigger, ref, printComponent, input, __designMode } = this.props;

        return (
            <div>
                <ReactToPrint
                    trigger={() => trigger}
                    content={() => {
                        if(printComponent) {
                            return loadRefComponent(printComponent.componentInfo, input)
                        }
                        return ref.current
                    }}
                />
            </div>
        );
    }
}

export default FastballPrint;