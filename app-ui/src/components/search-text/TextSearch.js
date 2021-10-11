import Multiselect from "multiselect-react-dropdown";
import { ObjectsList } from "./COCOv2ObjectList";

function TextSearchComponent(props) {
    
    return (
        <Multiselect
            isObject={false}
            onRemove={(selectedList, removedItem) => { props.selectedList(selectedList);}}
            onSearch={function noRefCheck() { }}
            onSelect={(selectedList, selectedItem) =>{ props.selectedList(selectedList); }}
            options={ObjectsList}
            placeholder="Select tags to search"
        />
    );
}

export default TextSearchComponent;