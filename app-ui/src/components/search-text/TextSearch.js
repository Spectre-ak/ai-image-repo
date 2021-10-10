import Multiselect from "multiselect-react-dropdown";


function TextSearchComponent() {
    return (
        <Multiselect
            isObject={false}
            onRemove={function noRefCheck() { }}
            onSearch={function noRefCheck() { }}
            onSelect={function noRefCheck() { }}
            options={["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"]}
        />
    );
}

export default TextSearchComponent;