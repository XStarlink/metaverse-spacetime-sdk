import localProxy from "../util/localProxy.js";

const friendManagementPanel = function(remoteController) {
    const friendManagementPanelWrapper = document.createElement("div");
    friendManagementPanelWrapper.id = "friendManagementPanelWrapper";
    friendManagementPanelWrapper.innerHTML = "Manage Friends";

    Object.assign(friendManagementPanelWrapper.style, {
        position: 'absolute',
        padding: '10px',
        top: '350px',
        transform: 'translate(0, -100%)',
        left: 'calc(50% - 150px)',
        width: '300px',
        textAlign: 'center',
        border: '1px solid #00FFF0',
        boxSizing: 'border-box',
        borderRadius: '10px',
        zIndex: 100,
        color: '#00FFF0'
    })
    


    const friendList = document.createElement("ul");
    friendList.id = "friendList";

    localProxy.friendList.forEach(friend => {
        friendListElement(friend, friendList);
    })

    function friendListElement(friend, parent) {
        const friendDisplay = document.createElement("li");
        friendDisplay.id = friend;
        friendDisplay.innerHTML = friend;
        parent.appendChild(friendDisplay);
    }

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "close"
    closeButton.addEventListener('click', () => {
        friendManagementPanelWrapper.remove()
    })
    
    const remotePeerIdInput =  document.createElement("input");
    remotePeerIdInput.id = "remotePeerIdInput";

    const acceptRemotePeerIdButton = document.createElement("button")
    acceptRemotePeerIdButton.id = 'acceptRemotePeerIdButton';
    acceptRemotePeerIdButton.innerHTML = "Add & Connect"
    acceptRemotePeerIdButton.addEventListener('click', () => {

        // get value of the input field
        const remotePeerId = remotePeerIdInput.value;
        
        // tell remoteController to try connect
        remoteController.connectToPeer(remotePeerId);

        // add the friend to the friend list
        let tempList = localProxy.friendList
        tempList.push(remotePeerId);
        localProxy.friendList = tempList

        // add the friend to the friend panel
        friendListElement(remotePeerId, friendList);
    })
    
    friendManagementPanelWrapper.appendChild(remotePeerIdInput);
    friendManagementPanelWrapper.appendChild(acceptRemotePeerIdButton);
    friendManagementPanelWrapper.appendChild(friendList);
    friendManagementPanelWrapper.appendChild(closeButton)

    document.body.appendChild(friendManagementPanelWrapper); 
}

export default friendManagementPanel; 