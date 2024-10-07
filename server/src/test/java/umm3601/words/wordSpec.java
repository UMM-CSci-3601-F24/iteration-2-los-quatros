// package umm3601.words;

// import static org.junit.jupiter.api.Assertions.assertFalse;
// import static org.junit.jupiter.api.Assertions.assertTrue;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;

// class WordsSpec {

//   private static final String FAKE_ID_STRING_1 = "fakeIdOne";
//   private static final String FAKE_ID_STRING_2 = "fakeIdTwo";

//   private Words word1;
//   private Words word2;

//   @BeforeEach
//   void setupEach() {
//     word1 = new Words();
//     word2 = new Words();
//   }

//   @Test
//   void wordsWithEqualIdAreEqual() {
//     word1._id = FAKE_ID_STRING_1;
//     word2._id = FAKE_ID_STRING_1;

//     assertTrue(word1.equals(word2));
//   }

//   @Test
//   void wordsWithDifferentIdAreNotEqual() {
//     word1._id = FAKE_ID_STRING_1;
//     word2._id = FAKE_ID_STRING_2;

//     assertFalse(word1.equals(word2));
//   }

//   @Test
//   void hashCodesAreBasedOnId() {
//     user1._id = FAKE_ID_STRING_1;
//     user2._id = FAKE_ID_STRING_1;

//     assertTrue(word1.hashCode() == word2.hashCode());
//   }

//   @Test
//   void wordsAreNotEqualToOtherKindsOfThings() {
//     user1._id = FAKE_ID_STRING_1;
//     assertFalse(word1.equals(FAKE_ID_STRING_1));
//   }
// }
