from flask import session

def getRole(auth_users):

    try:
        return auth_users[session["sID"]].roleId
    except:
        return None
            
    



