class node:
    def __init__(self, ch=0, isWord=False):
        self.children = {}
        self.isWord = isWord
        self.ch = ch



class Trie:
    """ A class for the Trie """
    def __init__ (self):
        self.root = node("root")
        self.insertDataMember = 0
          
    
    def insert(self, word: str)-> bool:

        #check if word exists
        if(self.search(word)):
            return False
        if(not word.isalpha()):
            return False
        
        current_node = self.root
        #go through every character in word
        for ch in word:
            ch = ch.lower()

            #check ch not in children
            if ch not in current_node.children: 
                #add ch to children
                current_node.children[ch] = node(ch)
                
            current_node = current_node.children[ch]
        #change isword
        current_node.isWord = True
        self.insertDataMember += 1
        
        return True


    def search(self, word: str) -> bool:
        current_node = self.root

        #traverse letters of word
        for ch in word:
            ch = ch.lower()
            #check if current letter in children
            if ch not in current_node.children:
                return False
            else:
                current_node = current_node.children[ch]

        return current_node.isWord

    
    def remove(self, word: str) -> bool:
        return self._remove(self.root, word, 0)
        
         
    #helper
    def _remove(self, current_node, word, index)-> bool:
        if index == len(word):
            #not a word
            if not current_node.isWord:
                return False
            
            #set node to not word
            current_node.isWord = False
            self.insertDataMember -= 1
            
            return True
        
        #not end of word, get next letter
        ch = word[index].lower()
        
        #check if ch not in children
        if ch not in current_node.children:
            return False
        
        return self._remove(current_node.children[ch], word, index + 1)



    def _clear(self, current_node):
        
     
        for node in current_node.children.values():
            self._clear(node)


        current_node.children.clear()
        current_node.isWord = False
        
        

    def clear(self):

        self._clear(self.root)
        self.root.children.clear()
        self.insertDataMember = 0
        return True


        
    def wordCount(self):
        return self.insertDataMember
    

    def _words(self, current_node, path, list):

        #check if this node is a word
        if current_node.isWord:
            list.append(path)

        for node in current_node.children.values():
            self._words(node, path + node.ch, list)



    def words(self):

        list = []
        #traverse through trie and add if word
        self._words(self.root, "", list)

        #sort list
        list.sort()

        return list

    #return words that start with prefix 
    def starts_with(self, prefix) -> list:
        node = self.root
        for ch in prefix.lower():
            if ch not in node.children:
                return []
            node = node.children[ch]

        results = []

        #call helper function to find words with prefix
        self._words(self.root, prefix, results)

        return results




# def debug():

#     trie = Trie()

#     print("debugging getFromFile")

#     trie.getFromFile("wordlist.txt")
#     print("word count:", trie.wordCount())
#     # print(trie.words())
    

# debug()
