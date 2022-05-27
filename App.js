import React, { useState, useEffect } from 'react';
import {SafeAreaView,View,Text,Image,StyleSheet,FlatList,ActivityIndicator, StatusBar, TouchableOpacity,Alert, Button} from 'react-native';

const App = () => {
  //declaración del estado para llamar la API completa
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);
  const [infoSource, setInfoSource] = useState([]);
  const [epSource, setEpSource] = useState([]);

  useEffect(() => {getData(), []});

  //Llamar a la API, obtener datos y llenar el arreglo
  const getData = () => {
    if (!loading && !isListEnd) {
      //console.log('getData');
      setLoading(true);
      //obtener el API
      fetch('https://rickandmortyapi.com/api/character/?page=' + offset)
        //Pidiendo datos por página
        .then((response) => response.json())
        .then((responseJson) => {
          //console.log(responseJson);
          setInfoSource(responseJson.info);
          if (responseJson.info.next) {
            setOffset(offset + 1);
            //aumentar la variable para cambiar de página
            setDataSource([...dataSource, ...responseJson.results]);
            setLoading(false);
          } else {
            setIsListEnd(true);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };



  const renderFooter = () => {
    return (
      //Simbolo de carga al cargar más personajes
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator color="black" style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };

  //Vista de cada item del arreglo
  const renderItem = ({ item }) => {
    return (
      // item de una flat list
      <TouchableOpacity style={styles.row}  onPress={() => getItem(item)}>
        
          <Image
            source={{ uri: item.image }}
            style={styles.avatar}
          />
          <Text style={{ marginLeft: 10, fontSize: 20 }} >
            {item.id}
            {'. '}
            {item.name}
            </Text>
      </TouchableOpacity>


    );
  };

  const getItem = (item) => {
    //mostrar detalles al clickear un item
    Alert.alert('Datos del personaje',
      'Name: ' + item.name + '\n' +
      'Status: ' + item.status + '\n' +
      'Specie: ' + item.species + '\n' +
      'Gender: ' + item.gender + '\n' +
      'Location: ' + item.location.name + '\n' +
      'Origin: ' + item.origin.name
    );
  };


  return (
    <SafeAreaView style={{flex:1, marginTop: StatusBar.currentHeight}}>
      <Text style={styles.title}>Personajes: {infoSource.count} </Text>
      <Button
        onPress={()=>{
          const randomItem = dataSource[Math.floor(Math.random() * dataSource.length)];
          Alert.alert('Random Character',
          'Name: ' + randomItem.name + '\n' +
          'Status: ' + randomItem.status + '\n' +
          'Specie: ' + randomItem.species + '\n' +
          'Gender: ' + randomItem.gender + '\n' +
          'Location: ' + randomItem.location.name + '\n' +
          'Origin: ' + randomItem.origin.name
        );
        }}
        title='Random Character'
        style={{}}
      />
      <FlatList
        data={dataSource}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        onEndReached={getData}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30, 
    alignItems: 'center',
    justifyContent: 'center', 
    textAlign:'center',
    fontWeight: "bold",
    margin:15
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  row: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    alignItems: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
});

export default App;
